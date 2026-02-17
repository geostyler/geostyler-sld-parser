module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Increase footer line length to accommodate long GitHub URLs in release commits
    'footer-max-line-length': [2, 'always', 200]
  },
  ignores: [
    // Ignore semantic-release commits which often have long footers with links
    (message) => message.includes('chore(release):')
  ]
};
