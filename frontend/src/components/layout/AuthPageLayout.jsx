import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Layout reutilizable para páginas de autenticación (Login, Register)
 */
function AuthPageLayout({ title, error, linkTo, linkText, children }) {
  // Separar texto del link por "?" para formatear correctamente
  const [textBefore, textAfter] = linkText ? linkText.split('?') : ['', ''];

  return (
    <div className="login-container">
      <h2>{title}</h2>
      {error && <p className="error-message">{error}</p>}
      {children}
      {linkTo && linkText && (
        <p className="login-link">
          {textBefore}? <Link to={linkTo}>{textAfter?.trim() || 'Aquí'}</Link>
        </p>
      )}
    </div>
  );
}

AuthPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
  children: PropTypes.node.isRequired,
};

AuthPageLayout.defaultProps = {
  error: '',
  linkTo: '',
  linkText: '',
};

export default AuthPageLayout;
