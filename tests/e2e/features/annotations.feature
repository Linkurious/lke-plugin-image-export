Feature: Annotations

  @annotations-arrow
  Scenario Outline: Draw an arrow
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I click download <name>  <outputFormat>
    Then The export <name> contains an arrow from <x1>,<y1> to <x2>,<y2>
  Examples:
    | x1 | y1 | x2  | y2  | name | outputFormat |
    | 500 | 500 | 700 | 600 | arrow.svg | svg |


