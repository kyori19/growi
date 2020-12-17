export default class EasyGrid {

  process(markdown) {
    // see: https://regex101.com/r/WR6IvX/3
    return markdown.replace(/:::\s*editable-row[\r\n]((.|[\r\n])*?)[\r\n]:::/gm, (all, group) => {
      return group;
    });
  }

}
