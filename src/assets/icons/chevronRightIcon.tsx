const ChevronRightIcon = ({ width = '15', height = '15', color='white' }: { width?: string; height?: string, color?: string }): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.158398 0.135077C0.359854 -0.0537882 0.676272 -0.043581 0.865137 0.157875L4.61514 4.15788C4.79545 4.3502 4.79544 4.64949 4.61514 4.84182L0.865136 8.84182C0.676271 9.04327 0.359853 9.05348 0.158397 8.86461C-0.0430589 8.67575 -0.0532659 8.35933 0.135599 8.15788L3.565 4.49985L0.1356 0.841816C-0.053265 0.64036 -0.043058 0.323942 0.158398 0.135077Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronRightIcon;
