import React from 'react';
import styles from './CategoryItems.module.scss';

function CategoryItems({ category, handleSubCategory }) {
  return (
    <div
      className={styles.container}
      onClick={() => handleSubCategory(category)}
    >
      {category}
    </div>
  );
}

export default CategoryItems;
