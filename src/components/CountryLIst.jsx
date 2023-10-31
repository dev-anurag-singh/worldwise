import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from './contexts/CitiesContext';

function CountryList() {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  const loadCitiesList = () => {
    return countries.map(country => {
      return (
        <CountryItem key={country.country} country={country}>
          City
        </CountryItem>
      );
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return <Message message='Add your first city by clicking on the map' />;
  }

  return <ul className={styles.countryList}>{loadCitiesList()}</ul>;
}

export default CountryList;
