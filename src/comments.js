import replace from 'replace'

/**
 * Comment Block not compatible with GASP environment.
 * @param {} filePaths
 */
export function comment(filePaths) {
  replace({
    regex:
      /\/\/ COMMENT THIS BLOCK IN GASP - START\r*\n(([^\n]+\n)+)\/\/ COMMENT THIS BLOCK IN GASP - END\r*\n/,
    replacement:
      '/* COMMENT THIS BLOCK IN GASP - START\n$1COMMENT THIS BLOCK IN GASP - END */\n',
    paths: filePaths,
    recursive: true,
    silent: true
  })
}

export function unComment(filePaths) {
  replace({
    regex:
      /\/\* COMMENT THIS BLOCK IN GASP - START\n(([^\n]+\n)+)COMMENT THIS BLOCK IN GASP - END \*\/\n/,
    replacement:
      '// COMMENT THIS BLOCK IN GASP - START\n$1// COMMENT THIS BLOCK IN GASP - END\n',
    paths: filePaths,
    recursive: true,
    silent: true
  })
}
