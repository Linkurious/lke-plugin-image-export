Feature: Size Format

  @format
  Scenario Outline: Select format
    Given I select format <format>
    Then I see it's size within the panel <format>
    And it updates on zoom <format>
  Examples:
    | format |
    | Square |
    | Full size |

  @select
  Scenario Outline: Select text size
    Given I select text size <size>
    Then I see it's updated within the viz <size>

  Examples:
    | size |
    | 200% |
    | 50% |

  @text-slider
  Scenario Outline: Select text size
    Given I go to main page
    When I toggle text slider
    Then text disappear
    And I toggle text slider
    Then text reapear

  Examples:
    | size |
    | 50% |