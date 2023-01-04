import { Link } from 'react-router-dom';
import Header from '../../components/header';

export default () => (
  <article>
    <Header noLink>Index</Header>
    <div className="preview-section">
      <ul className="ui-options">
        <li><Link to="/form">Form</Link></li>
        <li><Link to="/inputs">Inputs</Link></li>
      </ul>
    </div>
  </article>
);
