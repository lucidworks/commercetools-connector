/* eslint-disable import/prefer-default-export */
export function totalPrice(lineItem) {
  const { centAmount: unitCentAmount, ...unitPrice } =
    lineItem.price.discounted?.value || lineItem.price.value;
  const originalPrice = {
    ...unitPrice,
    centAmount: unitCentAmount * lineItem.quantity,
  };
  const price = { value: { ...originalPrice } };
  if (originalPrice.centAmount !== lineItem.totalPrice.centAmount) {
    price.discounted = { value: { ...lineItem.totalPrice } };
  }
  return price;
}
// eslint-disable-next-line max-len
const createPricePoints = (country) => (price) =>
  price.country === country ? 1 : 0;
export const toPrice = (
  prices,
  { country, currency, customerGroup, channel }
) => {
  const pricePonts = createPricePoints(country);
  return prices
    .filter(
      (p) =>
        p.value.currencyCode === currency &&
        p.customerGroup?.id === customerGroup &&
        p.channel?.id === channel
    ) // sort mutates but filter copied prices so no problem
    .sort((a, b) => pricePonts(b) - pricePonts(a))[0];
};
export const pageFromRoute = (route) => {
  const pageNum = Number(route.params.page);
  const page = Number.isNaN(pageNum) || pageNum <= 1 ? 1 : pageNum;
  return {
    page,
  };
};
export const pushPage = (page, component, name) => {
  const { params, query } = component.$route;
  component.$router.push({
    name,
    params: { ...params, page },
    query,
  });
};
export const changeRoute = (
  route,
  component,
  push = true,
  keepScrollPosition = true
) => {
  const pos = {
    top: window.scrollY,
    left: window.scrollX,
  };
  if (push) {
    component.$router.push(route);
  } else {
    component.$router.replace(route);
  }

  if (keepScrollPosition) {
    Promise.resolve().then(() => {
      window.scrollTo(pos);
    });
  }
};
export const locale = (component) => component?.$route?.params?.locale;
export const isToughDevice = () => "ontouchstart" in window;

export const modifyQuery = (key, value, query, add = true) => {
  const values = [value].concat(query[key]).filter((v) => add || v !== value);
  let newValue = [...new Set(values)].filter((v) => v !== undefined);
  newValue = newValue.length > 1 ? newValue : newValue[0];
  return newValue !== undefined
    ? {
        ...query,
        [key]: newValue,
      }
    : Object.entries(query).reduce(
        // eslint-disable-next-line no-shadow
        (result, [k, value]) => {
          if (k !== key) {
            // eslint-disable-next-line no-param-reassign
            result[k] = value;
          }
          return result;
        },
        {}
      );
};
