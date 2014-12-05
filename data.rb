require 'bundler/setup'
require 'json'
require 'faker'

$fields = ['id', 'name', 'email', 'age', 'salary', 'company']
$rows = []

1000.times do |id|
  name = Faker::Name.name
  email = Faker::Internet.free_email(name)
  age = [*18..65].sample
  salary = '$%.2f' % [*800..6000].sample
  company = Faker::Company.name

  $rows << [id, name, email, age, salary, company]
end

File.open('data.js', 'w') do |file|
  file << 'App.FIXTURES = ' << JSON.pretty_generate(values: $rows, fields: $fields)
end
