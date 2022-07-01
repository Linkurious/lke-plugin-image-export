@S9a4d8f09
Feature: Preview

  @open-close @T8eba6c47
  Scenario: Open Close outside
    Given I go to main page
    When I click preview
    Then I see the preview modal
    When I click outside the modal
    Then the modal closes

  @open-close @Tda9d2cb4
  Scenario: Open Close button
    Given I go to main page
    When I click preview
    Then I see the preview modal
    When I click the close button
    Then the modal closes

  #@zoom @Tec0a0c26
  # Scenario: Zoom-in/out
  #  Given I go to main page
  #  And I open preview and wait for loading
  #  When I click zoomin
  #  Then Preview zooms in
  #  And I click zoomout
  #  Then Preview zooms out

  @zoom @T048e8483
  Scenario: Reset zoom
    Given I go to main page
    And I open preview and wait for loading
    When I click zoomin
    And I click zoomin
    And I click reset
    Then Preview resets zoom
