package consts

type RoleType string

const (
	Admin              RoleType = "admin"
	User               RoleType = "user"
	Tester             RoleType = "tester"
	Developer          RoleType = "developer"
	ProductManager     RoleType = "product_manager"
	IntegrationAdmin   RoleType = "api-admin"
	IntegrationGeneral RoleType = "general"
)

func (e RoleType) String() string {
	return string(e)
}

type CategoryDiscriminator string

const (
	EndpointCategory CategoryDiscriminator = "endpoint"
	ScenarioCategory CategoryDiscriminator = "scenario"
	PlanCategory     CategoryDiscriminator = "plan"
	SchemaCategory   CategoryDiscriminator = "schema"
)

func (e CategoryDiscriminator) String() string {
	return string(e)
}

type TestStatus string

const (
	Draft     TestStatus = "draft"      //草稿
	Disabled  TestStatus = "disabled"   //已禁用
	Submitted TestStatus = "submitted"  //已提交
	ToExecute TestStatus = "to_execute" //待执行
	Executed  TestStatus = "executed"   //已执行
)

func (e TestStatus) String() string {
	return string(e)
}
