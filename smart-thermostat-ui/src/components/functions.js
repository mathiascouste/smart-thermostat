const maxFromRange = (values) => Math.max(...values)
const minFromRange = (values) => Math.min(...values)

const truncateTemperature = (value) => Math.trunc(value * 10) / 10

export default {
  minFromRange: minFromRange,
  maxFromRange: maxFromRange,
  truncateTemperature: truncateTemperature
}
