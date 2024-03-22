class inventoryfilter {
  constructor(name, type) {
    this.filterName = name
    this.FilterType = type
  }
}
const availabilityFilter = 'availability'
const categoryFilter = 'category'
const typeFilter = 'type'

const inventoryFilters = [
  new inventoryfilter('In stock now', availabilityFilter),
  new inventoryfilter('Circuits', categoryFilter),
  new inventoryfilter('High School', categoryFilter),
  new inventoryfilter('Math', categoryFilter),
  new inventoryfilter('Microcontrollers', categoryFilter),
  new inventoryfilter('Middle School', categoryFilter),
  new inventoryfilter('Primary', categoryFilter),
  new inventoryfilter('Robotics', categoryFilter),
  new inventoryfilter('Science', categoryFilter),
  new inventoryfilter('Teacher Resources', categoryFilter),
  new inventoryfilter('Tools', categoryFilter),
  new inventoryfilter('Upper Elementary', categoryFilter),
  new inventoryfilter('Education', typeFilter),
  new inventoryfilter('Electronics', typeFilter),
  new inventoryfilter('More', typeFilter),
  new inventoryfilter('Music', typeFilter),
  new inventoryfilter('Science & Engineering', typeFilter),
  new inventoryfilter('Toys & Games', typeFilter)
]

export { inventoryFilters as filterOptions, availabilityFilter, categoryFilter, typeFilter }
