import { useState } from 'react';
import Header from '../../components/header';
import DatePicker from '../../../src/react-datepicker';
import locale from './locale';
import theme from './theme';

export default () => {
  const [preselectedDate, setPreselectedDate] = useState(new Date(1994, 4, 16));
  const [selectedDate, setSelectedDate] = useState(null);

  const defaults = { theme, ...locale };

  return (
    <article>
      <Header noLink>nebenan-react-datepicker</Header>
      <div className="preview-section">
        <ul>
          <li>

            <h3>Simple</h3>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}

              {...defaults}
            />
          </li>
          <li>

            <h3>Preselected Date</h3>
            <DatePicker
              selected={preselectedDate}
              onChange={setPreselectedDate}

              {...defaults}
            />
          </li>
          <li>

            <h3>Min-Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date(2020, 2, 1)}

              {...defaults}
            />
          </li>
          <li>

            <h3>Max-Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              maxDate={new Date(2020, 4, 1)}

              {...defaults}
            />

          </li>
          <li>
            <h3>Min-Date & Max-Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              maxDate={new Date(2020, 4, 1)}
              minDate={new Date(2020, 2, 1)}

              {...defaults}
            />
          </li>
        </ul>
      </div>
    </article>
  );
};
