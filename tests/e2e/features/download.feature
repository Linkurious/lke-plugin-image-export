Feature: Download
  @download
  Scenario Outline: Download png
    Given I go to main page
    Given I open preview and wait for loading
    When I click download
    Then image is nice
  Examples:
    | dummy |
    | dummy |