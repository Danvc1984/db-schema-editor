//Standard input validations
//TODO: Update to be more specific in further iterations

export const checkInput = (value, rules) => {
  let isValid = [];

  if (rules.required) {
    isValid.push(value.trim() !== "");
  }

  if (rules.minLength) {
    isValid.push(value.length >= rules.minLength);
  }

  if (rules.maxLength) {
    isValid.push(value.length <= rules.maxLength);
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid.push(pattern.test(value));
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid.push(pattern.test(value));
  }

  return isValid.indexOf(false) > -1 ? false : true;
};
