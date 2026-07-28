<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor
	version="1.0.0"
	xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
	xmlns="http://www.opengis.net/sld"
	xmlns:ogc="http://www.opengis.net/ogc"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:se="http://www.opengis.net/se"
>
  <NamedLayer>
    <Name>PropertyName</Name>
    <UserStyle>
      <Name>PropertyName</Name>
      <Title>PropertyName</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Style Rule 0</Name>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">
                <ogc:PropertyName>color_prop</ogc:PropertyName>
              </CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
