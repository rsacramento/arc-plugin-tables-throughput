const { capitalize } = require("@architect/inventory/src/lib")

const unique = objArray => [...new Set(objArray.map(i => Object.keys(i)[0]))]

module.exports = {
	deploy: {
		start: async ({ arc, cloudformation }) => {
			let cfn = cloudformation

			const provisionedTables = arc["tables-throughput"]
			if (!Array.isArray(provisionedTables) || !provisionedTables.length) return cloudformation

			if (!Array.isArray(arc.tables) || !unique(provisionedTables).every(i => unique(arc.tables).includes(i))) {
				throw ReferenceError(`Specifying @tables-throughput requires specifying corresponding @tables`)
			}

			// Loop thru manifest tables
			arc.tables.forEach(table => {
				const name = Object.keys(table).pop()
				const tableName = name
					?.split(/[-._]/)
					.map(p => capitalize(p))
					.join("")
					.concat("Table")

				// Reduce attributes from manifest into CloudFormation DynamoDB properties
				cfn.Resources[tableName].Properties = provisionedTables
					.filter(throughputAttr => Object.keys(throughputAttr).pop() === name)
					.reduce((props, throughputAttr) => {
						props.BillingMode = "PROVISIONED"
						props.ProvisionedThroughput = {
							ReadCapacityUnits: throughputAttr[name].reading,
							WriteCapacityUnits: throughputAttr[name].writing,
						}
						return props
					}, cfn.Resources[tableName].Properties)
			})

			return cfn
		},
	},
}
