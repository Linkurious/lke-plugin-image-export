Feature: Download
  @download
  Scenario Outline: Download png
    Given I go to main page
    And I select format <format>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I click download <name>
    Then image is nice <name>
  Examples:
    | name           | outputFormat | format    | 
    | full-sie-1.png |     png      | Full size | 
    | square-1.png   |     png      |  Square   | 
