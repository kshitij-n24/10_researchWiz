import { Link } from 'react-router-dom';
import './SearchResults.css';
import addToHistAPI from '../API/addToHistAPI';

export default function SearchResults(props) {
  const email = localStorage.getItem('email');

  const handleClick = async (item) => {
    const { paperid } = item;

    localStorage.setItem('selectedPaperId', paperid);

    const response = await addToHistAPI({ email: email, paperid: paperid });
    if (response !== 200) {
      console.log('Failed at adding paper to history.');
    }
  };
    console.log(props)
  return (
    <div className="container">
      {props.search.length === undefined ? <div><p>No results found</p></div> : (props.search.map((item, index) => (
        <Link
          to={`/pdfviewer/${encodeURIComponent(item.paperid)}`}
          className="card mb-3"
          key={index}
          onClick={() => handleClick(item)}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-body">
            <h5 className="card-title">Title: {item.title}</h5>
            <p className="card-text">Author: {item.author.length <=5 ? item.author.join(' ') : `${item.author.slice(0, 5).join(' ')}...et al`}</p>
            <p className="card-text">Year: {item.year}</p>
          </div>
        </Link>
      )))}
    </div>
  );
}
