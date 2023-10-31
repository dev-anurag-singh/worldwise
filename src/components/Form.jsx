import Button from './Button';

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import BackButton from './BackButton';
import useUrlPosition from './hooks/useUrlPosition';
import ReactCountryFlag from 'react-country-flag';
import Message from './Message';
import Spinner from './Spinner';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from './contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();

  const [emoji, setEmoji] = useState();
  const [geocodingError, setGeocodingError] = useState(null);

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  const { createCity, isLoading } = useCities();

  const navigate = useNavigate();

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeocodingError(null);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode) {
          throw new Error('That does not seems like a valid city ');
        }
        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(data.countryCode);
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate('/app/cities');
  }

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }
  if (!lat && !lng) {
    return <Message message='Start by selecting a location' />;
  }

  if (isLoadingGeocoding) return <Spinner />;

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {<ReactCountryFlag countryCode={emoji} svg />}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <ReactDatePicker
          id='date'
          onChange={e => setDate(e)}
          selected={date}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
