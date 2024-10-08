import { FC } from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  titleClassName?: string;
  rightIcon?: React.ReactNode;
}
export const Header: FC<Props> = ({
  icon,
  title,
  titleClassName,
  rightIcon,
}) => {
  return (
    <div className="w-full relative flex justify-between items-center mb-5 min-h-11 ">
      <span className="flex gap-1 items-center">
        {icon}
        <h1 className={`${titleClassName} text-wrap text-3xl sm:text-4xl`}>
          {title}
        </h1>
      </span>
      {rightIcon}
    </div>
  );
};
