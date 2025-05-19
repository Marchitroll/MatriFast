import { Link } from 'react-router-dom';

function AuthPageLayout({ title, error, children, linkTo, linkText }) {
  return (
    <div className={`page ${title.toLowerCase().includes('iniciar sesión') ? 'login' : 'register'}`}>
      <h2>{title}</h2>
      {error && <p className="error-message">{error}</p>}
      {children}
      {linkTo && linkText && (
        <p className="login-link">
          {linkText.split('?')[0]}? <Link to={linkTo}>{linkText.split('?')[1] || 'Aquí'}</Link>
        </p>
      )}
    </div>
  );
}

export default AuthPageLayout;
