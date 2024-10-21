const ChevronDownIcon = ({
  width = '9',
  height = '5',
  color = 'white',
}: {
  width?: string;
  height?: string;
  color?: string;
}): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.135233 0.158031C0.324098 -0.0434251 0.640516 -0.0536321 0.841972 0.135233L4.5 3.56464L8.15803 0.135233C8.35949 -0.0536321 8.67591 -0.0434251 8.86477 0.158031C9.05364 0.359487 9.04343 0.675905 8.84197 0.86477L4.84197 4.61477C4.64964 4.79508 4.35036 4.79508 4.15803 4.61477L0.158031 0.86477C-0.0434251 0.675905 -0.0536321 0.359487 0.135233 0.158031Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronDownIcon;
