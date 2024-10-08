const CustomPlayIcon = ({ width = '20', height = '23' }: { width?: string; height?: string }): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.947 9.58366L3.23223 0.29322C1.95541 -0.461265 0 0.270898 0 2.13702V20.7134C0 22.3876 1.81702 23.3965 3.23223 22.5572L18.947 13.2713C20.3488 12.4453 20.3532 10.4096 18.947 9.58366Z"
        fill="white"
      />
    </svg>
  );
};

export default CustomPlayIcon;
