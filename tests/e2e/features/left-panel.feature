Feature: Size Format

  @format
  Scenario Outline: Select format
    Given I go to main page
    And I select format <format>
    Then I see it's size within the panel <format>
    And it updates on zoom <format>
  Examples:
    | format |
    | Square |
    | Full size |

  @select
  Scenario Outline: Select text size
    Given I go to main page
    And I select text size <size>
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
    | dummy |
    | dummy |

  @collide-switch
  Scenario Outline: Select text collision
    Given I go to main page
    When I toggle text collision
    Then text collide accordingly false
    And I toggle text collision
    Then text collide accordingly true

  Examples:
    | dummy |
    | dummy |

  @snap-switch
  Scenario Outline: Select snapping
    Given I go to main page
    When I toggle snapping
    Then snapping toggles accordingly true
    And I toggle snapping
    Then snapping toggles accordingly false

  Examples:
    | dummy |
    | dummy |