const PauseIcon = ({ width = '20', height = '20' }: { width?: string; height?: string }): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="90" height="90" fill="url(#pattern0_360_6)" />
      <defs>
        <pattern id="pattern0_360_6" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_360_6" transform="scale(0.0111111)" />
        </pattern>
        <image
          id="image0_360_6"
          width="90"
          height="90"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAABv0lEQVR4nO3cPUoDYRhF4Vupe9AlGt2lP5VxKRL7I4EpbIKYfMLl+N4+8ByYmXRvMpvNZrPZbDabzWaz2Ww2OzngBngEXoFPTu8TeAEegOv/4lky4A545/fbH39r96x8cs6J+h53bfUs2/Z6Xrqd1bNs2zfw0j1bPcsGHBaEHayeZWPRIvXEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Yg2jzBNrGGWeWMMo88QaRpkn1jDKPLGGUeaJNYwyT6xhlHliDaPME2sYZZ5YwyjzxBpGmSfWMMo8sYZR5ok1jDJPrGGUeWINo8wTaxhlnljDKPPEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Yg2jzBNrGGWeWMMo88QaRpkn1jDKPLGGUeaJNYwyT6xhlHliDaPME2sYZZ5YwyjzxBpGmSfWMMo8sYZR5ok1jDJPrGGUeWINo8wTaxhlnljDKPPEGkaZJ9YwyjyxhlHmiTWMMk+sYZR5Unb+7MPqifWgH2WeZduu1F66e6tn2Y4HU7fDqefuDbiyev7ijPD+zKhbu2fptidpd/y+/fCHdACejq/nXz45bZ7ZbDabzWaz2Ww2m81mswj2BY0LdofAZHslAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
};

export default PauseIcon;
