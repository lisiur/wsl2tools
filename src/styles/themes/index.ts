import { computed, reactive, ref, Ref, toRef, toRefs } from "vue";
import commonVars from "./common/vars";
import darkVars from "./dark/vars";
import naiveUiCommonThemeOverrides from './common/naiveUiVars'
import naiveUiDarkThemeOverrides from './dark/naiveUiVars'

////////////// utils
function camelToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

///////////// 通用监听 css 变量

// 缓存 vars
const vars = reactive<{ [k: string]: string }>({});

// documentElement 变量有变动，更新 vars
const observer = new MutationObserver(() => {
  const styles = getComputedStyle(document.documentElement);
  for (const v of Object.keys(vars)) {
    vars[v] = styles.getPropertyValue(v);
  }
});

// 监听 documentElement 上的 css变量 的变动
observer.observe(document.documentElement, {
  attributeFilter: ["style"],
  attributes: true,
});

export function useThemeVar(name: string): Ref<string> {
  if (!vars[name]) {
    vars[name] = getComputedStyle(document.documentElement).getPropertyValue(
      name
    );
  }
  return toRef(vars, name);
}

//////////// 监听内置 css 变量

const themeVars = {
  common: commonVars,
  dark: darkVars,
};

const currentTheme = ref<keyof typeof themeVars>('common')

const currentThemeVars = computed(() => {
  return themeVars[currentTheme.value]
})

export function getTheme() {
  return currentTheme
}

export type ThemeLiteral = keyof typeof themeVars

export function setTheme(theme: ThemeLiteral) {
  currentTheme.value = theme;
  setThemeVars(themeVars[theme]);
}

export function useThemeVars() {
  return toRefs(currentThemeVars)
}

const naiveUiOverrides = {
  common: naiveUiCommonThemeOverrides,
  dark: naiveUiDarkThemeOverrides,
}
export function getNaiveUiThemeOverrides() {
  return computed(() => {
    return naiveUiOverrides[currentTheme.value]
  })
}

function setThemeVar(key: string, val: string) {
  key = camelToKebabCase(key);
  if (!key.startsWith("--")) {
    key = "--" + key;
  }
  document.documentElement.style.setProperty(key, val);
}

function setThemeVars(vars: Record<string, string>) {
  Object.entries(vars).forEach(([key, val]) => {
    setThemeVar(key, val);
  });
}



