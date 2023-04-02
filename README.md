# [Architect][arc] plugin `@tables-throughput`

Enables Provisioned billing mode and defines reading and writing throughput for [DynamoDB][ddb] tables.

## Recommended Resources

[DynamoDB][ddb] is a powerful database, though different from both SQL and NoSQL databases. It is highly recommended to dig into Amazon's resources to familiarize yourself with it:

- [DynamoDB Core Components (start here!)][core]
- [Amazon's full DynamoDB documentation][ddb]
- [Managing settings on DynamoDB provisioned capacity tables][throughput]
- [Pricing for Provisioned Capacity][pricing]

## Syntax

- `@tables-throughput` is a feature subset of [`@tables`][tables]; as such, the names of your declared tables must match those of your [`@tables`][tables]
- The basic syntax for defining `@tables-throughput` specifies the base table name followed by `reading` and `writing` throughput
- `reading` throughtput is expressed as an integer, in Reading Capacity Unities (RCUs)
- `writing` throughtput is expressed as an integer, in Wrigint Capacity Unities (WCUs)
- When defined, they set the table's billing mode to provisioned (BillingMode: PROVISIONED) and specify its throughput
- By default, all [`@tables`][tables] are billed per request (BillingMode: PAY_PER_REQUEST), so not defining this plugin for a table leaves the billing mode as pay-per-request

## Example

This `app.arc` file defines two database tables, one billed per request (pets) and the other (people), provisioned:

```arc
@app
testapp

@tables
people
  pplID *String

pets
  petId *String

@tables-throughput
people
  reading 10
  writing 5
```

[arc]: https://arc.codes
[tables]: https://arc.codes/docs/en/reference/project-manifest/tables
[core]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
[ddb]: https://aws.amazon.com/documentation/dynamodb/
[throughput]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
[pricing]: https://aws.amazon.com/dynamodb/pricing/provisioned/
