Feature: Annotations

  @annotations-arrow
  Scenario Outline: Draw an arrow
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export <name> contains an arrow from <x1>,<y1> to <x2>,<y2>
  Examples:
    | x1 | y1 | x2  | y2  | name | outputFormat |
    | 500 | 500 | 700 | 600 | arrow.svg | svg |

  @annotations-text
  Scenario Outline: Draw a text
    Given I go to main page
    And I select annotation text
    And I draw a text from <x1>,<y1> to <x2>,<y2>
    And I change the text at <x3>,<y3> to "<text>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export <name> contains a text "<text>" at <x1>,<y1> to <x2>,<y2>
  Examples:
    | x1 | y1 | x2  | y2  | x3 | y3 | text | name | outputFormat |
    | 500 | 500 | 700 | 600 | 550 | 550 | Changed text | text.svg | svg |


  @annotations-arrow-direction
  Scenario Outline: Draw an arrow with direction
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open the arrow settings menu
    And I change the arrow direction to "<direction>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow with direction "<direction>"

  Examples:
    | x1 | y1 | x2  | y2  | direction | name | outputFormat |
    | 500 | 500 | 700 | 600 | head | arrow-head.svg | svg |
    | 500 | 500 | 700 | 600 | both | arrow-both.svg | svg |
    | 500 | 500 | 700 | 600 | none | arrow-none.svg | svg |

  @annotations-arrow-color
  Scenario Outline: Draw an arrow with color
    Given I go to main page
    And I select annotation arrow
    And I draw an arrow from <x1>,<y1> to <x2>,<y2>
    And I open the arrow settings menu
    And I change the arrow color to "<color>"
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I download <name> <outputFormat>
    Then The export "<name>" contains an arrow with color "<color>"
  Examples:
    | x1 | y1 | x2  | y2  | color | name | outputFormat |
    | 500 | 500 | 700 | 600 | 2 | arrow-color-2.svg | svg |
    | 500 | 500 | 700 | 600 | 4 | arrow-color-4.svg | svg |
    | 500 | 500 | 700 | 600 | 6 | arrow-color-6.svg | svg |
