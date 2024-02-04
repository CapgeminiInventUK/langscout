import styles from './outline-button.module.scss';
import React, { ReactNode } from 'react';
import Link from 'next/link';

interface BaseButtonProps {
  children: ReactNode;
}

interface WithHref {
  href: string;
  onClick?: React.MouseEventHandler<any>;
}

interface WithOnClick {
  href?: never;
  onClick: React.MouseEventHandler<any>;
}

type OutlineButtonProps = BaseButtonProps & (WithHref | WithOnClick);

const OutlineButton: React.FC<OutlineButtonProps> = ({ children, href, onClick }) => {
  if (href) {
    return (
      <Link href={href} className={styles.button}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default OutlineButton;
