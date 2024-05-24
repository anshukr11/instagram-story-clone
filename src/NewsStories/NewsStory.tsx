import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_KEY, GUARDIAN_API_KEY, NEWS_API, NEWS_ARTICLES_API, NYT_API, NYT_API_KEY, NYT_ARTICLES_API } from '../utils/constants';
import { categoryOptions } from '../utils/data';
import './NewsStory.css';

const NewsStories = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const newsApiResponse = await axios.get(`${NEWS_API}=${API_KEY}`);
      const nytResponse = await axios.get(`${NYT_API}=${NYT_API_KEY}`);

      const newsApiSources = newsApiResponse.data.sources.map((source: any) => ({ id: source.id, name: source.name, type: 'newsapi' }));
      const nytSources = nytResponse.data.results.map((source: any) => ({ id: source.section, name: source.display_name, type: 'nytimes'  }));

      setSources([...nytSources, ...newsApiSources, { id: 'gaurdian', name: 'Gaurdian Times', type: 'guardian'}]);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchArticles = async () => {
    const params = {
      apiKey: API_KEY,
      q: search,
      category,
      sources: source,
    };
    setLoading(true); 
    if (sourceType.includes('guardian')) {
      await fetchGuardianArticles();
    } else if (sourceType.includes('nytimes')) {
      await fetchNytArticles();
    } else {
      await fetchNewsApiArticles(params);
    }
    setLoading(false); 
  };

  const fetchNewsApiArticles = async (params: any) => {
    try {
      const response = await axios.get(`${NEWS_ARTICLES_API}`, { params });
      setArticles(response.data.articles);
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  }

  const fetchGuardianArticles = async () => {
    try {
      const response = await axios.get(`https://content.guardianapis.com/search?q=${search}&section=${category}&api-key=${GUARDIAN_API_KEY}`);
      setArticles(response.data.response.results.map((article: any) => ({
        title: article.webTitle,
        description: article.webTitle, // You can adjust this according to available data
        url: article.webUrl,
        urlToImage: '', // The Guardian API doesn't provide image URLs in search results
      })));
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };
  
  const fetchNytArticles = async () => {
    try {
      const params = {
        'api-key': NYT_API_KEY,
        q: search,
        fq: category,
      };
      const response = await axios.get(`${NYT_ARTICLES_API}`, { params });
      setArticles(response.data.response.docs.map((article: any) => ({
        title: article.headline.main,
        description: article.abstract,
        url: article.web_url,
        urlToImage: article.multimedia.length > 0 ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
      })));
    } catch (error: any) {
      alert(error?.response?.data?.message);
    }
  };
  

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handleSourceChange = (e: any) => {
    const selectedSourceId = e.target.value;
    const selectedSource = sources.find(source => source.id === selectedSourceId);
    
    if (selectedSource) {
      setSourceType(selectedSource.type)
    }
    
    setSource(selectedSourceId);
  };

  if(loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>News Aggregator</h1>
        <input type="text" placeholder="Search articles..." value={search} onChange={handleSearch} />
        <select onChange={handleCategoryChange} value={category}>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select onChange={handleSourceChange} value={source}>
          <option value="">Select Source</option>
          {sources.map((source: any) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
        <button onClick={fetchArticles}>Search</button>
      </header>
      <main>
        {articles.length > 0 ? (
          <ul>
            {articles.map((article: any) => (
              <li key={article.url}>
                <img src={article.urlToImage} alt={article.title} />
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found</p>
        )}
      </main>
    </div>
  );
};

export default NewsStories;