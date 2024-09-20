const CustomNextIcon = ({ width = '15', height = '22' }: { width?: string; height?: string }): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 1.0628V20.9378C15 21.2472 14.7469 21.5003 14.4375 21.5003H12.1875C11.8781 21.5003 11.625 21.2472 11.625 20.9378V12.669L2.46094 21.1534C1.49531 21.955 0 21.2847 0 20.0003V2.0003C0 0.715923 1.49531 0.0456102 2.46094 0.847173L11.625 9.27999V1.0628C11.625 0.753423 11.8781 0.500298 12.1875 0.500298H14.4375C14.7469 0.500298 15 0.753423 15 1.0628Z"
        fill="white"
      />
    </svg>
  );
};

export default CustomNextIcon;
