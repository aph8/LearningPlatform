"use client";

import React from "react";
import { AutocompleteInputProps } from "../helper/apiTypes";
import styles from "../styles/AutocompleteInput.module.scss";

const AutocompleteInput = <T,>({
  label,
  query,
  onQueryChange,
  items,
  onItemSelect,
  itemKey,
  itemLabel,
}: AutocompleteInputProps<T>) => {
  return (
    <div className={styles.autocompleteContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        placeholder={`Type to search ${label.toLowerCase()}...`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className={styles.input}
      />
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={itemKey(item)}
            onClick={() => onItemSelect(item)}
            className={styles.listItem}
          >
            {itemLabel(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteInput;
