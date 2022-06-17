Feature: Download
  @download
  Scenario Outline: Download png
    Given I open preview
    When I click download
    Then image is nice
  Examples:
    | dummy |
    | dummy |