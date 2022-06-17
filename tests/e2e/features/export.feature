Feature: Export
  @export
  Scenario Outline: Export at size
    Given I go to main page
    And I select format <format>
    And I open preview and wait for loading
    Then image is of size <width> <height>
  Examples:
    | width | height | format    |
    | 616   | 640    | Full size |
    | 960   | 960    | Square    |