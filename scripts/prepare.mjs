if (process.env.SKIP_HUSKY === '1') {
  process.exit(0)
}

const husky = (await import('husky')).default
husky()
