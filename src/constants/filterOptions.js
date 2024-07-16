class sortOption {
  constructor(name, column) {
    this.name = name
    this.column = column
  }
}
class inventoryfilter {
  constructor(name, type, column, subFilters) {
    this.filterName = name
    this.filterType = type
    this.filterColumn = column
    this.subFilters = subFilters
    if (!subFilters) {
      this.subFilters = []
    }
  }
}
const availabilityFilter = 'availability'
const categoryFilter = 'category'
const typeFilter = 'type'

const sortOptions = [
  new sortOption('Relevance', 'C asc, B desc'),
  new sortOption('Date Added', 'B desc'),
  new sortOption('Name A-Z', 'C asc'),
  new sortOption('Name Z-A', 'C desc')
]

const inventoryFilters = [
  new inventoryfilter('In stock now', availabilityFilter, 'F'),
  new inventoryfilter('Circuits', categoryFilter, 'J'),
  new inventoryfilter('High School', categoryFilter, 'J'),
  new inventoryfilter('Math', categoryFilter, 'J'),
  new inventoryfilter('Microcontrollers', categoryFilter, 'J'),
  new inventoryfilter('Middle School', categoryFilter, 'J'),
  new inventoryfilter('Primary', categoryFilter, 'J'),
  new inventoryfilter('Robotics', categoryFilter, 'J'),
  new inventoryfilter('Science', categoryFilter, 'J'),
  new inventoryfilter('Teacher Resources', categoryFilter, 'J'),
  new inventoryfilter('Tools', categoryFilter, 'J'),
  new inventoryfilter('Upper Elementary', categoryFilter, 'J'),
  new inventoryfilter('Lego Sets', categoryFilter, 'J'),
  new inventoryfilter('Education', typeFilter, 'H', [
    new inventoryfilter('Curriculum', typeFilter, 'I'),
    new inventoryfilter('Education Kits', typeFilter, 'I'),
    new inventoryfilter('Education Supplies', typeFilter, 'I'),
    new inventoryfilter('Education Equipment', typeFilter, 'I')
  ]),
  new inventoryfilter('Electronics', typeFilter, 'H', [
    new inventoryfilter('Microcontrollers', typeFilter, 'I'),
    new inventoryfilter('Other Electronic Devices', typeFilter, 'I'),
    new inventoryfilter('Robots', typeFilter, 'I')
  ]),
  new inventoryfilter('More', typeFilter, 'H'),
  new inventoryfilter('Music', typeFilter, 'H'),
  new inventoryfilter('Science & Engineering', typeFilter, 'H', [
    (new inventoryfilter('General Measurement', typeFilter, 'I'),
    new inventoryfilter('Lab Instruments & Equipment', typeFilter, 'I'))
  ]),
  new inventoryfilter('Toys & Games', typeFilter, 'H', [
    new inventoryfilter('Legos', typeFilter, 'I')
  ])
]

export {
  inventoryFilters as filterOptions,
  availabilityFilter,
  categoryFilter,
  typeFilter,
  sortOptions
}
