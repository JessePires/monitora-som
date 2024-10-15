const PencilIcon = ({ width = '12', height = '12' }: { width?: string; height?: string }): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.8143 2.18508L9.81469 5.18547L3.29947 11.7007L0.624379 11.996C0.266263 12.0356 -0.036307 11.7328 0.0035357 11.3747L0.301184 8.69772L6.8143 2.18508ZM11.6704 1.73837L10.2616 0.329581C9.82219 -0.10986 9.10947 -0.10986 8.67003 0.329581L7.34467 1.65494L10.3451 4.65533L11.6704 3.32997C12.1099 2.8903 12.1099 2.17781 11.6704 1.73837Z"
        fill="#fff"
      />
    </svg>
  );
};

export default PencilIcon;
