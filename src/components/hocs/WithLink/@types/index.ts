export type TLinks = {
  [key: string]: {
    text: string;
    link: string;
    target: string;
  };
};

export type TWithLinkProps = {
  children: string;
  links: TLinks;
  tag?: string;
  className?: string;
  linkClassName?: string;
};
