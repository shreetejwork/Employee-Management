import { COMPANY } from "../../constants/company";

const VARIANTS = {
  icon: { src: "icon" },
  full: { src: "full" },
  login: { src: "full" },
  slip: { src: "full" },
  slipIcon: { src: "icon" },
};

const DEFAULT_CLASSES = {
  icon: "w-10 h-10 object-contain",
  full: "h-8 w-auto object-contain",
  login: "h-12 w-auto object-contain",
  slip: "h-14 w-auto object-contain",
  slipIcon: "w-12 h-12 object-contain",
};

const CompanyLogo = ({
  variant = "full",
  className = "",
  alt,
  boxed = false,
  boxClassName = "",
}) => {
  const config = VARIANTS[variant] || VARIANTS.full;
  const src = config.src === "icon" ? COMPANY.logoIcon : COMPANY.logoFull;
  const defaultAlt = alt || COMPANY.shortName;

  const image = (
    <img
      src={src}
      alt={defaultAlt}
      draggable={false}
      className={`${className || DEFAULT_CLASSES[variant] || DEFAULT_CLASSES.full}`}
    />
  );

  if (boxed) {
    return (
      <div
        className={`bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${boxClassName}`}
      >
        {image}
      </div>
    );
  }

  return image;
};

export default CompanyLogo;
