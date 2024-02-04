import { ref } from "vue";

export const useTypewriter = (string: string, time: number) => {
  const currentString = ref("");
  const currentIndex = ref(0);

  // totelTime.value = string.length * time
  let clock = setInterval(() => {
    currentIndex.value += 1;
    if (string.length >= currentIndex.value) {
      currentString.value = string.substring(0, currentIndex.value);
    } else {
      clearInterval(clock);
    }
  }, time);

  return { currentString };
};

export const getFileBirthTime = (url: string) => {
  // console.log("fs", fs);
  // const srcDir = process.argv.slice(2)?.[1] || ".";
  // console.log("srcDir: ", srcDir);
  // const files = import.meta.glob("./dir/*.js");
  // console.log("files: ", files);
  // let date = new Date();
  // try {
  //   // 参考 vitepress 中的 getGitTimestamp 实现
  //   const infoStr = spawnSync("git", ["log", "-1", '--pretty="%ci"', url])
  //     .stdout?.toString()
  //     .replace(/["']/g, "")
  //     .trim();
  //   if (infoStr) {
  //     date = new Date(infoStr);
  //   }
  // } catch (error) {
  //   return formatDate(date);
  // }
  // return formatDate(date);
};
