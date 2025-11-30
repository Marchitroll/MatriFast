import PropTypes from 'prop-types';

/**
 * Botón de submit reutilizable con estado de carga
 */
function SubmitButton({ isLoading, loadingText, defaultText }) {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? loadingText : defaultText}
    </button>
  );
}

SubmitButton.propTypes = {
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  defaultText: PropTypes.string.isRequired,
};

SubmitButton.defaultProps = {
  isLoading: false,
  loadingText: 'Cargando...',
};

export default SubmitButton;
