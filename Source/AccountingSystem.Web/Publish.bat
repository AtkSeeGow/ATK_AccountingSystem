call dotnet publish -c Release -r linux-x64

call cd .\bin\Release\netcoreapp2.1\linux-x64\publish\wwwroot\app

call npm install
call npm run tsc

call cd ../../../../../../../

call docker build -t atkseegow/accounting_system_web:2.1.1 .
call docker push atkseegow/accounting_system_web:2.1.1

call docker tag atkseegow/accounting_system_web:2.1.1 atkseegow/accounting_system_web:latest 
call docker push atkseegow/accounting_system_web:latest
