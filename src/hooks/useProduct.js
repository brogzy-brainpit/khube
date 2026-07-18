import { useEffect, useMemo, useState } from "react";

export default function useProduct(product) {
 
  const variants = useMemo(
    () => product.variants.edges.map(({ node }) => node),
    [product]
  );

  const initialVariant =
    variants.find((variant) => variant.availableForSale) ||
    variants[0];

  const [selectedOptions, setSelectedOptions] = useState(() => {
    const obj = {};

    initialVariant.selectedOptions.forEach((option) => {
      obj[option.name] = option.value;
    });

    return obj;
  });

   useEffect(() => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);

  if (!params.toString()) return;

  const nextOptions = {};

  product.options.forEach((option) => {
    const value = params.get(option.name);

    if (value) {
      nextOptions[option.name] = value;
    }
  });

  if (Object.keys(nextOptions).length > 0) {
    setSelectedOptions((prev) => ({
      ...prev,
      ...nextOptions,
    }));
  }

}, []);
useEffect(() => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  let changed = false;

  Object.entries(selectedOptions).forEach(([key, value]) => {
    if (url.searchParams.get(key) !== value) {
      url.searchParams.set(key, value);
      changed = true;
    }
  });

  if (changed) {
    window.history.replaceState(
      window.history.state,
      "",
      url.toString()
    );
  }
}, [selectedOptions]);

  const selectedVariant = useMemo(() => {
    return (
      variants.find((variant) =>
        variant.selectedOptions.every(
          (option) =>
            selectedOptions[option.name] === option.value
        )
      ) || initialVariant
    );
  }, [selectedOptions, variants]);

  function selectOption(optionName, optionValue) {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: optionValue,
    }));
  }

  const currentImage =
selectedVariant.image ??
product.images.edges[0]?.node;

  /**
   * Can this option be selected?
   */
  function isOptionAvailable(optionName, optionValue) {
  return variants.some((variant) =>
    variant.selectedOptions.every((option) => {
      if (option.name === optionName) {
        return option.value === optionValue;
      }

      return selectedOptions[option.name] === option.value;
    })
  );
}

  return {
    variants,
    selectedVariant,
    selectedOptions,
    selectOption,
    isOptionAvailable,
    currentImage,
    
  };
}