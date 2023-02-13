import React, { useEffect, useRef, useState } from "react";
import styles from "../select.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (v?: SelectOption) => void;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (v: SelectOption[]) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export default function Select({
  multiple,
  value,
  options,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearValue() {
    multiple ? onChange([]) : onChange();
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((val) => val !== option));
        return;
      }
      onChange([...value, option]);
      return;
    }
    onChange(option);
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // e.target 也有可能會是這個 container 裡面的 element
      // 要先確保 e.target 就是 container 自己本身才執行
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((pre) => !pre);
          if (isOpen) {
            selectOption(options[highlightedIndex]);
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        case "Escape":
          setIsOpen(false);
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      console.log("return");
      containerRef.current?.removeEventListener("keydown", handler);
    };

    // 當這些依賴值改變時，要重新設置 handler
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((pre) => !pre)}
    >
      <div className={styles.value}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                className={styles["value-badge"]}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
              >
                <span>{v.label} </span>
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label}
      </div>
      <button
        className={styles.clearBtn}
        onClick={(e) => {
          e.stopPropagation();
          clearValue();
        }}
      >
        &times;
      </button>
      <div className={styles.divider} />
      <button className={styles.caret} />
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, idx) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              highlightedIndex === idx ? styles.highlighted : ""
            }
            ${isOptionSelected(option) ? styles.selected : ""}`}
            onClick={() => selectOption(option)}
            onMouseEnter={() => setHighlightedIndex(idx)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
