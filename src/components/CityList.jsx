import CityItem from './CityItem';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from './contexts/CitiesContext';

function CityList() {
  const { cities, isLoading, currentCity } = useCities();

  const loadCitiesList = () => {
    return cities.map(city => {
      return <CityItem key={city.id} city={city} />;
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return <Message message='Add your first city by clicking on the map' />;
  }

  return <ul className={styles.cityList}>{loadCitiesList()}</ul>;
}

export default CityList;
