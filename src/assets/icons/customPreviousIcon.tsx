const CustomPreviousIcon = ({ width = '15', height = '22' }: { width?: string; height?: string }): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20.9378V1.0628C0 0.753423 0.253125 0.500298 0.5625 0.500298H2.8125C3.12188 0.500298 3.375 0.753423 3.375 1.0628V9.33155L12.5391 0.847173C13.5047 0.0456102 15 0.715923 15 2.0003V20.0003C15 21.2847 13.5047 21.955 12.5391 21.1534L3.375 12.7206V20.9378C3.375 21.2472 3.12188 21.5003 2.8125 21.5003H0.5625C0.253125 21.5003 0 21.2472 0 20.9378Z"
        fill="white"
      />
    </svg>
  );
};

export default CustomPreviousIcon;
