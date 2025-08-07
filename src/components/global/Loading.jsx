import '../../assets/styles/global/loading.css';

export const LoadingSpinnerWithOverlay = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-background"></div>
      </div>
    </div>
  );
};

export const LoadingSpinnerWithoutOverlay = () => {
  return (
    <div className="spinner-center">
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-background"></div>
      </div>
    </div>
  );
}
