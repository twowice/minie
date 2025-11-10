interface HeartFilledIconCustomProps {
  className?: string;
  size?: string;
  filledColor: string;
  strokeColor: string;
  stroke?: string;
}

type SvgAttributes = Omit<
  React.SVGProps<SVGSVGElement>,
  keyof HeartFilledIconCustomProps
>;

type HeartFilledIconProps = HeartFilledIconCustomProps & SvgAttributes;

const HeartFilledIcon = ({
  className,
  size = "24px",
  filledColor,
  strokeColor = "currentColor",
  ...props
}: HeartFilledIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      stroke={strokeColor}
      {...props}
    >
      <path
        d="M16 27.0102L14.26 25.4502C12.24 23.6302 10.57 22.0602 9.25 20.7402C7.93 19.4202 6.88 18.2352 6.1 17.1852C5.32 16.1352 4.775 15.1702 4.465 14.2902C4.155 13.4102 4 12.5102 4 11.5902C4 9.71023 4.63 8.14023 5.89 6.88023C7.15 5.62023 8.72 4.99023 10.6 4.99023C11.64 4.99023 12.63 5.21023 13.57 5.65023C14.51 6.09023 15.32 6.71023 16 7.51023C16.68 6.71023 17.49 6.09023 18.43 5.65023C19.37 5.21023 20.36 4.99023 21.4 4.99023C23.28 4.99023 24.85 5.62023 26.11 6.88023C27.37 8.14023 28 9.71023 28 11.5902C28 12.5102 27.845 13.4102 27.535 14.2902C27.225 15.1702 26.68 16.1352 25.9 17.1852C25.12 18.2352 24.07 19.4202 22.75 20.7402C21.43 22.0602 19.76 23.6302 17.74 25.4502L16 27.0102Z"
        fill={filledColor}
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default HeartFilledIcon;
