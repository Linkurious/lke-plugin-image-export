Feature: Download
  @download
  Scenario Outline: Download png
    Given I go to main page
    And I select format <format>
    And I select text size <size>
    And I drag the viz <drag>
    And I set text visibility <textVisible>
    And I set text collision removal <collisionRemoval>
    And I open preview and wait for loading
    And I select output format <outputFormat>
    When I click download <name>
    Then image is nice <name>
  Examples:
    | name            | outputFormat | format    | drag   | size | textVisible | collisionRemoval |
    | full-size-1.png |     png      | Full size | false  | 200% |  true       |   false          |
    | square-1.png    |     png      |  Square   | false  | 50%  |  true       |   true           |
    | full-size-2.png |     png      | Full size | true   | 50%  |  true       |   true           |
    | square-2.png    |     png      |  Square   | true   | 200% |  true       |   false          |
    | square-3.png    |     png      |  Square   | false  | 100% |  false      |   true           |

