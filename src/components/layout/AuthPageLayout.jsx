import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Layout reutilizable para páginas de autenticación (Login, Register)
 */
function AuthPageLayout({ title, error, linkTo, promptText, actionText, linkText, children }) {
  let prompt = promptText;
  let action = actionText;

  if (!prompt && !action && linkText) {
    const parts = linkText.split('?');
    prompt = parts[0] ? `${parts[0]}?` : '';
    action = parts[1] ? parts[1].trim() : 'Aquí';
  }

  return (
    <div className="login-container">
      <h2>{title}</h2>
      {error && <p className="error-message">{error}</p>}
      {children}
      {linkTo && (prompt || action) && (
        <p className="login-link">
          {prompt} <Link to={linkTo}>{action}</Link>
        </p>
      )}
    </div>
  );
}

AuthPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  linkTo: PropTypes.string,
  promptText: PropTypes.string,
  actionText: PropTypes.string,
  linkText: PropTypes.string,
  children: PropTypes.node.isRequired,
};

AuthPageLayout.defaultProps = {
  error: '',
  linkTo: '',
  promptText: '',
  actionText: '',
  linkText: '',
};

export default AuthPageLayout;
